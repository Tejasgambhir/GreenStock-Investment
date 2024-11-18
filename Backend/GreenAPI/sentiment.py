import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import tensorflow as tf
import pandas as pd
import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize, word_tokenize
from transformers import BertTokenizer, BertForSequenceClassification,pipeline
import torch
import re



import numpy as np
import pickle
with open('Eco-friendly stock advisor\\Backend\\GreenAPI\\motley-fool-data.pkl', 'rb') as file:
    df = pickle.load(file)
    print("load...")

# ESG GENERATION CODE:

finbert_esg = BertForSequenceClassification.from_pretrained('yiyanghkust/finbert-esg',num_labels=4)
tokenizer_esg = BertTokenizer.from_pretrained('yiyanghkust/finbert-esg')
esg_label_pip = pipeline("text-classification", model=finbert_esg, tokenizer=tokenizer_esg) 

finbert_sentiment = BertForSequenceClassification.from_pretrained('yiyanghkust/finbert-tone',num_labels=3)
tokenizer_sentiment = BertTokenizer.from_pretrained('yiyanghkust/finbert-tone')
sentiment_pipeline = pipeline("text-classification", model=finbert_sentiment, tokenizer=tokenizer_sentiment)


def split_transcript(transcript,section):
    print('split_transcript')
    # Normalize the transcript to lowercase for consistent searching
    lower_transcript = transcript.lower()
    
    # Define markers for the sections
    prepared_remarks_marker = "prepared remarks:"
    qa_marker = "questions and answers:"
    
    # Find the starting index of the "Prepared Remarks" section
    start_prepared = lower_transcript.find(prepared_remarks_marker)
    # Find the starting index of the "Questions and Answers" section
    start_qa = lower_transcript.find(qa_marker)

    # Extracting the "Prepared Remarks" section
    if start_prepared != -1:
        end_prepared = start_qa if start_qa != -1 else len(transcript)  # Until Q&A or end of transcript
        prepared_remarks = transcript[start_prepared:end_prepared].strip()
    else:
        prepared_remarks = ""

    # Extracting the "Questions and Answers" section
    if start_qa != -1:
        qa_section = transcript[start_qa:].strip()
    else:
        qa_section = ""

    if section ==  prepared_remarks_marker:
        return prepared_remarks
    return qa_section



# Splitting the transcript




def get_esg_label_transcript(tr):
    print("esg label...")
    sent_label_scores = []
    for sent in sent_tokenize(tr):
        all_esg_labels = esg_label_pip(sent)
        non_none_labels = [x for x in all_esg_labels if x['label']!='None']
        if(len(non_none_labels)>0):
            sent_label_scores.append([non_none_labels[0]['label'],non_none_labels[0]['score'],sent])
    df = pd.DataFrame(sent_label_scores, columns=['esg_label', 'label_score', 'sent'])
    
    return(df)

def create_sentiment_output(all_labels):
    non_none_labels = [x for x in all_labels if x['label']!='None']
    if(len(non_none_labels)>0):
        label = non_none_labels[0]['label']
        score = non_none_labels[0]['score']
        if(label=='Positive'):
            return(1*score)
        elif(label=='Negative'):
            return(-1*score)
        else:
            return 0
    else:
        return 0
    
    
######  ESG ######
######  ESG ######
def generate_esg_cols(row,section='transcript'):
    extracted_section = split_transcript(row['transcript'],section)
    if(extracted_section!=np.nan):
        label_scores_df = get_esg_label_transcript(extracted_section)
        label_scores_df['sentiment'] = label_scores_df.sent.apply(lambda x: create_sentiment_output(sentiment_pipeline(x)))
        label_scores_df.sentiment = label_scores_df.sentiment.apply(lambda x:np.round(x,4))
        clean_scores = label_scores_df[((label_scores_df.label_score>0.7) & (label_scores_df.sentiment!=0))]
        group_senti = clean_scores.groupby('esg_label')['sentiment'].median().reset_index()
        print(group_senti)
        for e in group_senti.esg_label.to_list():
            row[e+'_'+section] = group_senti[group_senti.esg_label==e].sentiment.iloc[0]
        # missing_cols = list(set(cols_expect)-set(group_senti.esg_label.to_list()))
        # missing_cols = [c for c in cols_expect if c not in group_senti.esg_label.to_list()]
        # for c in missing_cols:
        #     row[c+'_'+section] = np.nan
    # else:
    #     for c in cols_expect:
    #         row[c+'_'+section] = np.nan
    return(row)


def generate_esg_cols_sections(tic, df):
    # Filter the DataFrame by the provided ticker
    df_ticker = df[df['ticker'] == tic].copy()
    df_ticker = df_ticker.head(5)
    print(len(df_ticker))  
    try:
        # Apply the function to each row for 'prepared remarks' and 'QnA'
        df_ticker = df_ticker.apply(lambda x: generate_esg_cols(x, "prepared remarks:"), axis=1)
        df_ticker = df_ticker.apply(lambda x: generate_esg_cols(x, "questions and answers:"), axis=1)
    except Exception as e:
        print(f"Error processing ticker {tic}: {e}")
        return df_ticker

    return df_ticker

# Test the function with the loaded DataFrame
dataset = generate_esg_cols_sections("MSFT", df)
dataset.drop(columns=['transcript'],inplace=True)
dataset.to_csv('output.csv', index=False)
data= pd.DataFrame(dataset)
print(data.columns)



# transcript sentiment 
ticker_list = ["AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "META", "TSLA", "BRK-B", "TSM", "V", "JNJ", "WMT", "JPM", "MA", "PG", "UNH", "NVDA", "HD", "PYPL", "DIS", "ADBE", "NFLX", "VZ", "KO", "NKE", "PFE", "INTC", "PEP", "CMCSA", "CSCO"]
combined_data = []
for tic in ticker_list:
    dataset = generate_esg_cols_sections(tic, df)
    dataset.drop(columns=['transcript'],inplace=True)
    combined_data.append(dataset)
    
final_dataset = pd.concat(combined_data, ignore_index=True)

# Save the combined DataFrame to a CSV file
final_dataset.to_csv('/kaggle/working/output.csv', index=False)

print("done")


# ESG SCORE CALCULATION
import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv('/kaggle/input/esg-score/output(3).csv')

def calculate_overall_esg_score(row, section):
    esg_categories = ['Environmental', 'Social', 'Governance']
    scores = [
        row[f'{category}_{section}'] if not pd.isnull(row[f'{category}_{section}']) else 0.55
        for category in esg_categories
    ]
    # Calculate the average ESG score for the section
    overall_score = round(sum(scores) / len(scores), 2)
    return overall_score
    
def detect_greenwashing(row, threshold=0.15):
    greenwashing_flags = False
    esg_prepared_remark = row['Overall_prepared_remarks_esg']
    esg_questions_and_answers =row['Overall_qa_esg']
    # Flag greenwashing only if the Prepared Remarks score is higher than the Q&A score
    if (esg_prepared_remark  - esg_questions_and_answers) > threshold:
        greenwashing_flags = True  # Possible greenwashing detected
    else:
        greenwashing_flags = False  # No greenwashing detected
    return greenwashing_flags

df['Overall_prepared_remarks_esg'] = df.apply(lambda row: calculate_overall_esg_score(row, 'prepared remarks:'), axis=1)
df['Overall_qa_esg'] = df.apply(lambda row: calculate_overall_esg_score(row, 'questions and answers:'), axis=1)
df['greenwashing_detected'] = df.apply(lambda row: detect_greenwashing(row), axis=1)
# Display the DataFrame with the new columns
print(df)

# Save the results to a CSV file if needed
df.to_csv('/kaggle/working/overall_esg_scores.csv', index=False)
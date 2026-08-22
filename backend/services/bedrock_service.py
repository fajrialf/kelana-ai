from pathlib import Path
import os

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

AWS_BEARER_TOKEN_BEDROCK = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
AWS_REGION = os.getenv("AWS_REGION")
MODEL_ID = os.getenv("MODEL_ID")


def configure_bedrock_api_key():
    if not AWS_REGION:
        raise ValueError("AWS_REGION is not configured in .env")

    if not MODEL_ID:
        raise ValueError("MODEL_ID is not configured in .env")

    if AWS_BEARER_TOKEN_BEDROCK:
        os.environ["AWS_BEARER_TOKEN_BEDROCK"] = AWS_BEARER_TOKEN_BEDROCK

    return boto3.client(
        service_name="bedrock-runtime",
        region_name=AWS_REGION,
    )


def get_ai_recommendation(destination, days, budget, travel_style):
    prompt = (
        "You are an experienced travel planner. "
        f"Plan a {days}-day itinerary for {destination}. "
        f"Budget: USD {budget}. "
        f"Travel style: {travel_style}.\n\n"
    )

    client = configure_bedrock_api_key()

    try:
        response = client.converse(
            modelId=MODEL_ID,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
        )
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"Failed to get Bedrock recommendation: {exc}") from exc

    return response["output"]["message"]["content"][0]["text"]

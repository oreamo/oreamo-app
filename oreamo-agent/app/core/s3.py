import boto3
from botocore.config import Config

from app.core.config import settings

s3_client = boto3.client(
    "s3",
    region_name=settings.aws_region,
    endpoint_url=settings.aws_s3_endpoint,
    aws_access_key_id=settings.aws_s3_access_key,
    aws_secret_access_key=settings.aws_s3_secret_key,
    config=Config(s3={"addressing_style": "path"}),
)

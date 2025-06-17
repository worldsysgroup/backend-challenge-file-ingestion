# File Processor Challenge

This project is a Node.js service designed to process large data files and insert the records into a SQL Server database efficiently. It runs in a local Kubernetes environment and demonstrates strategies for performance, error tolerance, and modular deployment.

## Prerequisites

- Node.js installed
- Docker Desktop with Kubernetes enabled
- AWS S3 bucket with the input file uploaded
- AWS credentials with access to the bucket
- Kubernetes secrets configured (see below)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Build Docker image

```bash
docker build -t file-processor:latest .
```

### 3. Update Kubernetes secrets

Make sure the following files are correctly configured with your credentials:

- k8s/secrets/aws-secret.yaml
- k8s/secrets/sqlserver-secret.yaml

*The init-sql-database job has the database host (sqlserver) and user (sa) predefined. Only the password is injected from the sqlserver-secret. If you modify the host or user values in the secret, the job may fail to connect.

### 4. Execute script

```bash
chmod +x scripts/k8s-apply-all.sh
./scripts/k8s-apply-all.sh
```

## Test the service

### Expose the file processor:

```bash
kubectl port-forward service/file-processor 3000:3000
```

### Use Postman or cURL to test the following endpoints:

- POST /process/file – Processes the local file
- POST /process/s3 – Processes the file from S3
- GET /health – Liveness/readiness check

### Expose DB:

Once processing is complete, access SQL Server:

```bash
kubectl port-forward service/sqlserver 1433:1433
```

You can then connect to the database using a client (like Azure Data Studio or DBeaver) with:

- Server: localhost
- Port: 1433
- User: sa
- Password: your defined password
- DB name: datosclientes
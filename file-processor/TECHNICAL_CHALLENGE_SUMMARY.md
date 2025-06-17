# Technical Challenge Summary

## Project Context

This challenge consists of processing a .dat file with a large volume of records and inserting them into a SQL Server database. The processing service must run inside a Kubernetes environment.

## Strategy and Architecture

I opted for a modular architecture with two separate pods: one for the SQL Server database and one for the Node.js data processor. This separation improves scalability and maintainability.
The SQL pod uses a Persistent Volume Claim (PVC) to persist data across pod restarts.
I used AWS S3 to host the input file, allowing scalable and efficient access.

## Performance & Robustness Measures

- Batch processing: The processor reads the file line-by-line using a stream and accumulates a batch (e.g., 1000 lines) before inserting using bulk insert. This prevents memory overload and optimizes DB interaction.
- Bulk Insert: Reduces the number of DB calls, improving throughput and reducing DB locking or contention issues.
- Fault tolerance: Corrupt or malformed lines are skipped without stopping the process.
- Health probes and resource limits (CPU/memory) are defined for both pods to support stability.

## Bottleneck Considerations

Initial DB pod setup failed under default limits. I tuned the resources to requests: 1Gi/500m and limits: 2Gi/1CPU to avoid OOMKilled errors.
The processor pod uses minimal resources (128Mi/100m), suitable for controlled ingestion loads.

## Improvements for Production

- Horizontal scaling: Split the file and process each part in parallel using multiple pods.
- Expose query endpoints: A /records endpoint could serve paginated results from the DB.
- Secrets management: Use AWS Secrets Manager or Kubernetes External Secrets for better security.
- Monitoring: Add metrics endpoints or integrate with Prometheus/Grafana for resource usage insights.
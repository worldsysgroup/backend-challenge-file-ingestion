kubectl apply -f k8s/secret-sql.yaml
kubectl apply -f k8s/secret-aws.yaml
kubectl apply -f k8s/configmap-initdb.yaml
kubectl apply -f k8s/pvc-sqlserver.yaml
kubectl apply -f k8s/deployment-sqlserver.yaml
echo "Waiting for SQL Server pod to be ready..."
kubectl wait --for=condition=ready pod -l app=sqlserver --timeout=120s
kubectl apply -f k8s/job-initdb.yaml
kubectl apply -f k8s/deployment-file-processor.yaml
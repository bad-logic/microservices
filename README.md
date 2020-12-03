MICROSERVICES ORCHESTRATION USING KUBERNETES:\
SERVICES\
client => React server side rendering using next js\
auth service => REST API based authentication service\
orders service => REST API based order service that store the client orders\
ticket service => REST API based ticket service that creates tickets that are              eventually booked by the clients.

EVENT-BUS\
nats streaming server => used to emit different events (e.g: ticketcreated, ticketupdated, ordercreated, ordercancelled etc)

DATABASE:\
MongoDb => Each service has their own copy of mogodb database

HOW TO RUN THE APPLICATION:

USING KUBERNETES:\
=> skaffold.yaml and infra directory is specifically for kubernetes only\
=> start k8s cluster\
=> RUN below command to generate secrets in the cluster\
=> kubectl create secret generic jwt-secret --from-literal=JWT_KEY=someRANDOMjwtKEY\
=> RUN skaffold dev which will create docker images and eventually run the                    kubernetes deployments files that is inside the infra directory.\
=> go to your k8s cluster ip in the browser

USING DOCKER COMPOSE:\
=> docker-compose.yml and reverse_proxy directory is specifically for docker compose only\
=> RUN docker-compose build && docker-compose up\ 
=> above command will create docker images and eventually run those in container.\
=> got to your localhost:80 in your browser.\

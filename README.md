MICROSERVICES ORCHESTRATION USING KUBERNETES:\
SERVICES\
client => React server side rendering using next js
auth service => REST API based authentication service\
orders service => REST API based order service that store the client orders\
ticket service => REST API based ticket service that creates tickets that are              eventually booked by the clients.\

EVENT-BUS\
nats streaming server => used to emit different events (e.g: ticketcreated, ticketupdated, ordercreated, ordercancelled etc)\

DATABASE:\
MongoDb => Each service has their own copy of mogodb database\
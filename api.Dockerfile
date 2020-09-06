# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang

WORKDIR /go/src/breath-right-one
ADD go.mod .
RUN go mod download
# Copy the local package files to the container's workspace.
ADD . /go/src/breath-right-one
# WORKDIR /go/src/breath-right-one
# Build the outyet command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
# RUN go get breath-right-one

# RUN go mod download

RUN go install breath-right-one/api

ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_HOST
ARG DB_PORT
ARG DB_CONN_STRING
ARG SUGAR

# Run the outyet command by default when the container starts.
ENTRYPOINT /go/bin/api

# Document that the service listens on port 8080.
EXPOSE 8000

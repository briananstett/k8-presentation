# Base Image
FROM node:8.14.0-alpine

# Create a new directory in the container's fs
RUN mkdir  /nodeApp

# Move to the new directory
WORKDIR /nodeApp

# Copy from current directory to /nodeApp
COPY . /nodeApp

# Setup an environment variable You could have also set this with -e of --env-file
ENV PORT=3000

# Tells Docker or users of your image which ports this container listens on
expose 3000

# Run npm start when the container starts
CMD npm start


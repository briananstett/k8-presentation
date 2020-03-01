FROM centos:7
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum -y install nodejs
COPY . /JohnnyApp
WORKDIR /JohnnyApp
RUN npm install

CMD npm start
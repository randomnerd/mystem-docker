FROM frolvlad/alpine-glibc
RUN mkdir -p /opt/app &&\
    cd /opt/app &&\
    apk --no-cache add curl nodejs npm &&\
    curl -L https://download.cdn.yandex.net/mystem/mystem-3.1-linux-64bit.tar.gz > ./mystem.tar.gz &&\
    tar zxvf mystem.tar.gz &&\
    rm mystem.tar.gz &&\
    mv mystem mystem-linux &&\
    apk --no-cache del -r curl
COPY . /opt/app
WORKDIR /opt/app
RUN npm i --production
ENV NODE_ENV production
EXPOSE 8911
CMD ["node", "index.js"]

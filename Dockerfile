FROM node:22-alpine

# Timezone
ENV TZ=Asia/Seoul

RUN apk --no-cache add tzdata && \
  cp /usr/share/zoneinfo/$TZ /etc/localtime && \
  echo $TZ > /etc/timezone \
  apk del tzdata

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN [ "npm", "ci" ]

COPY . .

ENTRYPOINT [ "./run.sh" ]

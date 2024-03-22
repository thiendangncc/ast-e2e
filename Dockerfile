FROM node:18.19.1

RUN apt update && apt install software-properties-gtk gconf-service -y
RUN apt install -y fonts-liberation libasound2 libnspr4 libnss3 libu2f-udev libvulkan1 xdg-utils
RUN wget https://mirror.cs.uchicago.edu/google-chrome/pool/main/g/google-chrome-stable/google-chrome-stable_123.0.6312.58-1_amd64.deb -O google-chrome.deb
RUN dpkg -i google-chrome.deb

RUN mkdir -p /app/e2e/

WORKDIR /app/e2e/

COPY . .

RUN npm i

ENTRYPOINT npm run test:feature
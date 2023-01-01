FROM python:3.9.6

WORKDIR /app
ADD ./backend/requirements.txt /app/backend/

RUN pip3 install --upgrade setuptools
# RUN apt-get update python3-setuptools
RUN pip3 install --upgrade pip
RUN pip3 install gunicorn
RUN pip3 install -r backend/requirements.txt

ADD ./docker /app/docker
ADD ./backend /app/backend
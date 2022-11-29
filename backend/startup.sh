python3 -m pip install virtualenv
python3 -m virtualenv -p python3.9 venv
source venv/bin/activate
pip install -r requirements.txt
python PB/manage.py makemigrations
python PB/manage.py migrate
# Please create a super user before the server runs 
python PB/manage.py createsuperuser
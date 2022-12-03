# backend setup
python3 -m pip install virtualenv
python3 -m virtualenv -p python3.9 venv
source venv/bin/activate
pip install -r backend/requirements.txt
python backend/PB/manage.py makemigrations
python backend/PB/manage.py migrate

# frontend setup
cd frontend/pf
npm install


# Please create a super user before the server runs 
python PB/manage.py createsuperuser
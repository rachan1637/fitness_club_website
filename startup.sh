# backend setup
cd PB
python3 -m pip install virtualenv
python3 -m virtualenv -p python3 venv
source PB/venv/bin/activate
pip install -r requirements.txt
python PB/manage.py makemigrations
python PB/manage.py migrate
cd ..

# frontend setup
cd PF
npm install

cd ..
# Please create a super user before the server runs 
python PB/PB/manage.py createsuperuser
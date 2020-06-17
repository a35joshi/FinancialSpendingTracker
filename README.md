# Financial Spending Tracker

## Project setup instructions

The IDE used is Visual Studio Code. Install it from here: https://code.visualstudio.com/

<br />

**Windows:**

**_Setting up the backend server_**

1. Install the latest version of python onto your computer
2. Open an instance of command prompt or powershell (if you use powershell you will want to switch it to command prompt mode by typing cmd)
3. Navigate to the api folder
4. After python is installed, use pip to install the virtualenvwrapper for windows https://pypi.org/project/virtualenvwrapper-win/
5. Create a virtual environment with `mkvirtualenv venv`
   Note: any time you close the command prompt if you want to get back into the virtual envorinment you'll need to use `workon venv`
   also,tbe virtual environment can be deleted with the command `rmvirtualenv venv`
6. With your virtual envorinment activated run `pip install -r requirements.txt` to install the backend packages that the test uses
7. Run `python manage.py migrate` to create the sql database
8. you can now run the backend server any time with python manage.py runserver (ensure you are in the virtual envorinment before running this command)

**Setting up the frontend server**

1. Install the LTS version of nodejs from https://nodejs.org/en/
2. Install the yarn package manager https://classic.yarnpkg.com/en/
3. Open an additional instance of command prompt or powershell (if you use powershell you will want to switch it to command prompt mode by typing cmd)
4. Navigate to the src folder
5. run yarn to install the frontend packages that the test uses
6. you can now run the frontend server any time with yarn dev
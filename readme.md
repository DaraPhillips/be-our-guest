# BeOurGuest

## Overview

This project aims to develop a cloud-based software Application to allow its Users to Organise and manage their created wedding events.

## Features

-**Create Event:** Enables User to create an Event.
-**Edit Event:** Enables the User to edit the Event Details (Time, Date, Venue)
-**Delete Event:** Enables the User to Delete the Event.
-**Countdown Timer:** Shows the time until the Event.
-**RSVP Functionality:** Enables event guests to RSVP online by Email.

## Installation

1. **Download Visual Studio Code (VS Code)** :

* Go to the [VS Code website](https://code.visualstudio.com/) and download the installer for your operating system.
* Follow the installation instructions to install VS Code on your computer.

2. **Clone the repository** :

* Open GitHub Desktop.
* Go to the repository page on GitHub.
* Click on the "Code" button and copy the repository URL.
* In GitHub Desktop, click on "File" in the menu bar, then select "Clone repository".
* Paste the repository URL and choose a local path to clone the repository to.
* Click "Clone" to download the repository to your local machine.

3. **Open VS Code from GitHub Desktop** :

* In GitHub Desktop, navigate to the cloned repository.
* Press Ctrl + Shift + A to open VS Code.

4. **Open a terminal in VS Code** :

* Once VS Code is open, press Ctrl + ` (backtick) to open the integrated terminal.
* Alternatively, click on "Terminal" in the VS Code menu and select "New Terminal".

5. **Navigate to the project directory** :

* In the terminal, type: `cd be_our_guest_website` and press Enter.

6. **Install dependencies** :

* Run `npm install` in the terminal to install project dependencies.

7. **Start the website server** :

* Run `.\website` in the terminal to start the website server.

8. **Start the client server** :

* Run `.\client.cmd` in the terminal to start the client server.

9. **Navigate to the React directory** :

* In the terminal, type: `cd react` and press Enter.

10. **Open the Vite Link** :

* Once the client server is running, navigate to the provided Vite Link in your web browser to view the React application.

***Install the database:**

* Open the terminal and navigate to the project directory.
* Run `python manage.py shell` to open the Django shell.
* Type the following commands:
  ```python
  from be_our_guest.utils import setup_system_default_data
  setup_system_default_data()
  ```
* Press Enter to execute the commands.

## Usage

1. Register for an account or log in if you already have one.
2. Navigate to the desired feature (Create event, Edit Profile, View my Events).
3. Follow on-screen instructions to utilize the features effectively.
4. Provide feedback or report any issues through the appropriate channels.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

This project relies on the following frameworks, tools, and platforms:

- [Django](https://www.djangoproject.com/): A high-level Python web framework that encourages rapid development and clean, pragmatic design.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Postman](https://www.postman.com/): A collaboration platform for API development that allows you to design, build, and test APIs quickly.
- [Visual Studio Code](https://code.visualstudio.com/): A lightweight but powerful source code editor that supports various programming languages and extensions.
- [GitHub](https://github.com/): A platform for hosting and collaborating on Git repositories, facilitating version control and project management.

## Contact

For questions or inquiries, please contact ().

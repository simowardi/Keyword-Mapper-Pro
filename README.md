# Keyword Mapper Pro

![Keyword Mapper Pro Logo](https://files.catbox.moe/ekrgib.jpg))


## Introduction

Keyword Mapper Pro is a powerful 3-in-1 keyword tool designed to transform your online marketing strategy by streamlining your keyword research process. Whether you're a seasoned marketer or just starting, this tool offers a comprehensive suite of features to enhance your SEO efforts.

## Installation

To get started with ShareBlast, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/simowardi/Keyword-mapper-pro.git
    cd Keyword-mapper-pro/KMP
    ```

2. **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install the dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Set up the database**:
    ```bash
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
    ```

5. **Run the application**:
    ```bash
    flask run
    ```

## Usage

1. **Register**: Create a new account by providing a username, email, and password.
2. **Login**: Log in with your registered credentials.
3. **keyword_explorer**: Get Google suggestions based on the given keyword, language and country.
4. **keyword_filter**: filter keyword list that do not contain any of the positive keywords.
5. **keyword_grouper**: Endpoint to group keywords based on a minimum length.


## Contributing

We welcome contributions from the community! To contribute:

1. **Fork the repository**:
    ```bash
    git fork https://github.com/simowardi/Keyword-mapper-pro.git
    ```

2. **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```

3. **Commit your changes**:
    ```bash
    git commit -m "Add your commit message here"
    ```

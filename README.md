# lessteps [![Build Status](https://semaphoreci.com/api/v1/rafoli/lessteps/branches/master/badge.svg)](https://semaphoreci.com/rafoli/lessteps)

Some useful commands for Liferay 7.0/DXP developers

## Install

```
$ npm install -g lessteps
```


## Usage

<h1>
	<img width="300" src="https://rawgit.com/rafoli/lessteps/master/logo.png" alt="lessteps">
</h1>

```
$ les -h

  Usage: les [options] [command]


  Commands:

    init               Create Liferay's bundle (default profile - dev)
    initdb             Init a DB instance
    git [options]      Git commands
      -s, --status            Projects status
      -p, --pull              Pull projects
      -c, --commit [message]  Commit projects
      -b, --branch [name]     Create a new branch
      -r, --run [command]     Command    
    gradle [options]   Gradle commands
      -d, --deploy         Build, Install and Deploy
      -r, --run [command]  Command
    test [options]     Git commands
      -u, --unitTest         Run unitTest
      -f, --functionalTest   Run functionalTest
      -s, --sanityTest       Run sanityTest
      -i, --integrationTest  Run integrationTest
      -c, --coverage         Run test coverage    

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -c, --commit [message]  Commit projects
    -d, --deploy            Deploy projects
    -p, --pull              Pull projects
    -b, --branch [name]     Create a new branch
    -s, --status            Project status
    -u, --update            Update lessteps
```


## License

MIT © [Rafael Oliveira](https://github.com/rafoli)

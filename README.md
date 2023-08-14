## (DEPRECATED)

# lessteps [![Build Status](https://semaphoreci.com/api/v1/rafoli/lessteps/branches/master/badge.svg)](https://semaphoreci.com/rafoli/lessteps)

Some useful commands for Liferay 7.0/DXP developers

## Install

```
$ npm install -g lessteps
```


## Usage

<h1>
	<img width="400" src="https://rawgit.com/rafoli/lessteps/master/logo.png" alt="lessteps">
</h1>

```
$ les -h

  Usage: les [options] [command]


  Commands:

    init                                Create Liferay's bundle (default profile - dev)
    initdb                              Init a DB instance
    update                              Update lessteps     
    git [options]                       Git commands
      -s, --status                      Projects status
      -p, --pull                        Pull projects
      -c, --commit [message]            Commit projects
      -b, --branch [name]               Create a new branch
      -r, --run [command]               Command    
    gradle [options]                    Gradle commands
      -d, --deploy                      Build, Install and Deploy
      -f, --deployParallel              Build, Install and Deploy in Parallel
      -r, --run [command]               Command
    test [options]                      Git commands
      -u, --unitTest                    Run unitTest
      -f, --functionalTest              Run functionalTest
      -s, --sanityTest                  Run sanityTest
      -i, --integrationTest             Run integrationTest
      -c, --coverage                    Run test coverage     
    qa [options]                        QA commands (ex.: les qa master,ISSUE-3)
    mr [options]                        MR commands  
      -h, --help                        Output usage information
      -g, --group [group]               Owner username
      -u, --user [user/assignee]        User/Assigne name
      -t, --targetBranch [targetBranch] Target branch
      -m, --message [message]           Message of MR
      -d, --description [description]   Description of MR
      -l, --labels [labels]             Labels for MR as a comma-separated list        

  Options:

    -h, --help                          Output usage information
    -V, --version                       Output the version number
    -s, --status                        Project status
    -b, --branch [name]                 Create a new branch
    -d, --deploy                        Deploy projects
    -x, ----skipDownload                Skip downloads and checks
```


## License

MIT © [Rafael Oliveira](https://github.com/rafoli)

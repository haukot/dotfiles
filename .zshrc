# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="khelek"

# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Comment this out to disable bi-weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment to change how often before auto-updates occur? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want to disable command autocorrection
# DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Uncomment following line if you want to disable marking untracked files under
# VCS as dirty. This makes repository status check for large repositories much,
# much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(git rails rebar git_flow_avh brew hub-completion github notifyosd)

 [ -e ~/.oh-my-zsh/custom/plugins/notifyosd/notifyosd.zsh ] && . ~/.oh-my-zsh/custom/plugins/notifyosd/notifyosd.zsh
source $ZSH/oh-my-zsh.sh

# Customize to your needs...

setopt GLOB_COMPLETE
unsetopt BASH_AUTO_LIST

# Ignore duplicates while appending and erase duplicates from old history
HISTCONTROL=ignoredups:erasedups


alias copyv='rsync -r -h -b -v  --backup-dir=/tmp/rsync --progress'

alias gt='git'
alias gs='git st'
alias gp='git put'
alias gup='git up'
alias gdif='git dif'
alias gdifc='git difc'
alias gad='git add'
alias gci='git ci'
alias gcim='git cim'

alias gcod='git checkout develop'
alias gcom='git checkout master'
alias gcos='git checkout staging'
alias gm-='git merge - --no-ff'
alias rdeploy='gcod && gcom && gm- --no-edit && (echo "git push master:" && gp) && cap production deploy && gcod'
alias ecunmerged="git st | grep UU | cut -d' ' -f2 | head -1 | xargs ec"
alias gaddunmerged="git st | grep UU | cut -d' ' -f2 | head -1 | xargs git add"

alias dc='docker-compose'
alias docker_rm_running='sudo docker rm -f $(sudo docker ps -q)'
alias docker_rm_all='sudo docker rm -f $(sudo docker ps -qa)'
alias docker_rm_untagged_images="sudo docker images | grep '<none>' | awk '{print $3}' | xargs sudo docker rmi -f"
docker_compose_exec() {
  sudo docker exec -it $(sudo docker-compose ps | grep $1 | awk '{print $1}') ${@:2}
}
alias bring_my_files_back_bitch="sudo chown -R haukot:haukot ."

kubeexec() {
  POD=$(kubectl --namespace=$1 get pods | grep $2 | head -n 1 | awk '{ print $1 }')
  echo "connects to $POD"
  kubectl --namespace=$1 exec -it $POD ${@:3}
}

alias proc='ps ax | grep'
alias please='sudo $(fc -ln -1)'

alias spark-notebook='sudo docker run --rm -v `pwd`:/opt/docker/notebooks/mounted -p 9000:9000 andypetrella/spark-notebook:0.6.2-scala-2.11.7-spark-1.6.0-hadoop-2.2.0-with-hive-with-parquet'
alias py=python

# cd to currend project
alias cdcp='cd ~/programming/projects/simcase_bigdata/rails'


# functions
# set brightness. example - 'brightness 300'
brightness() { sudo su -c "echo $* > /sys/class/backlight/intel_backlight/brightness" }

release_container() {
    echo "nachaly!"
    gp
    (git branch -D release || true)
    git checkout -b release
    make container || return 1
    gcod
    gm- --no-edit
    gco -
    gcom
    gup
    gm- --no-edit
    gp
    gcod
    gp
}

# tunnelup/down for mrshoebox.com
function tunnelup() {
 ssh -f -N $1
 echo "Started tunnel $1"
}

function tunneldown() {
 pkill -f "ssh -f -N $1"
 echo "Killed tunnel $1"
}
alias tunnellist='ps waux | grep "ssh -f -N"'

# cd aliases
setopt cdable_vars
export blackbox="/home/haukot/programming/projects/blackbox_challenge"
export simcase="/home/haukot/programming/projects/simcase_bigdata"
export myblog="/home/haukot/programming/blog"


unsetopt nomatch


source ~/.exports

xmodmap $HOME/.Xmodmap

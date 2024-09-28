SESH="dev_environment"

tmux has-session -t $SESH 2>/dev/null

if [ $? != 0 ]; then
    tmux new-session -s $SESH -n "next-client" -d
    tmux send-keys -t $SESH:next-client "yarn dev" C-m
    tmux split-window -h -t $SESH
    tmux select-pane -t $SESH:0.0
fi

tmux attach-session -t $SESH



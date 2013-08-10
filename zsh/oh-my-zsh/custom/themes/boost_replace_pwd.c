#include <stdio.h>
#include <stdlib.h>



int main(int argc, char **argv)
{
    if(argc < 3)
    {
        printf(stderr, "Give 2 args!\n");
        exit(-1);
    }

    char *arg1 = argv[1];//$HOME
    char *arg2 = argv[2];//pwd

    printf(stdout, "You gave: %s, %s\n", arg1, arg2);

    return 0;
}

#!/bin/bash

# options:
# -n: (name) nama longtask
# -p: (pid) kode longtask
# -u: (username) user_id pemroses
# -i: (id) dokumen id yang di proses

# contoh eksekusi
# ./tfi-tbsyncrv.sh -n process-tbsyncrv -p 123456780 -u 5effbb0a0f7d1 -i RV/05/WH-JKT/2300000001


clear

input_var_n=""  # name longtask
input_var_p=""  # pid longtask
input_var_u=""  # username longtask
input_var_d=""  # id dokument longtask -> parameter ini bisa diganti2 disesuaikan, misalnya tanggal, doc id, dll


while getopts n:p:u:i: flag
do
	case "${flag}" in
		n) input_var_n="--name ${OPTARG}";;
		p) input_var_p="--pid ${OPTARG}";;
		u) input_var_u="--username ${OPTARG}";;
		d) input_var_d="--data ${OPTARG}";;
	esac
done

opt="$input_var_n $input_var_p $input_var_u $input_var_d"
command="php /var/www/html/fgta4/kalista/cli  fgta/riset/longtask/taskworker $opt"

echo "\$ $command"
$command
echo
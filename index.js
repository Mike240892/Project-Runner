#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

program.version('0.0.1')
    //.command()
    .argument('[filename]', 'Name of a file to execute')
    //.argument()
    //.option()
    .action( async ({ filename }) => {
        const name = filename || 'index.js';

        try{
            await fs.promises.access(name);
        } catch (err){
            throw new Error(`Couldn't find the file ${name}`);
        }

        let proc;
        const start = debounce(() => {
            if(proc){
                proc.kill();
            }
            console.log(chalk.bold.blue('>>>> Starting process...'));
            proc = spawn('node', [name], { stdio: 'inherit' });
        }, 120);

        chokidar.watch('.', {
            ignored: /\.git.|node_modules/
        })
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });

program.parse(process.argv);



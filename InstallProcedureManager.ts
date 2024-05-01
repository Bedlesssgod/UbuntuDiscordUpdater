import {exec} from "node:child_process";
import process from "node:process";
import fs from "node:fs";
import {Readable} from "node:stream";

export async function removeOld() {
    return exec(`sudo dpkg -r discord`, (err, stdout, stderr) => {
        if (err) {
            console.log("Error removing discord: " + err);
        }
    });
}

export async function installNew(ver: string) {
    return exec(`sudo dpkg -i ${process.env.HOME}/discordUpdater/discord-0.0.${ver}.deb`, (err, stdout, stderr) => {
        if (err) {
            console.log("Error installing discord: " + err);
        }
    });
}

export async function removeDeb(ver: string) {
    return exec(`rm -r -f ${process.env.HOME}/discordUpdater/discord-0.0.${ver}.deb`, (err, stdout, stderr) => {
        if (err) {
            console.log("Error removing file: " + err);
        }
    });
}

export async function fetchFile(url : string, path : string, filename : string) {
    const resp = await fetch(url);
    if(resp.ok && resp.body) {
        let writer = fs.createWriteStream(path + "/" + filename);
        // @ts-ignore
        Readable.from(resp.body).pipe(writer);
        return writer.on('finish', () => {
           return Promise.resolve(true);
        });
    } else {
        throw new Error("Failed to fetch file Response: " + resp + "\nURL: " + url);
    }
}

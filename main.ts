import fs, {mkdir} from "node:fs";
import * as process from "node:process";
import {exec} from "node:child_process";
import * as util from "./InstallProcedureManager";

const fallbackPath = `/home/${process.env.USER}/.config/discord/Local State`;
const invalidArgument = "Invalid argument, please use --manual or run it without any arguments.";
const invalidArgumentManual = "--manual <version-number>"
let path: string;
let discordLink = "https://dl.discordapp.net/apps/linux/0.0.%s/discord-0.0.%s.deb?arch=x64"

interface DiscordLocalState {
    updateclientdata: {
        apps: {
            oimompecagnajdejgnnjijobebaeigek: {
                cohort: string,
                cohortname: string,
                dlrc: number,
                fp: string,
                installdate: number,
                pf: string,
                pv: string;
            }
        }
    }

}

interface Config {
    path: string,
    discordLink: string
}

init();

async function init() {
    path = fallbackPath;
    createDir();
    createFile();
    loadFile();
    if (process.argv.length > 2 && process.argv.length != 4) {
        console.log(invalidArgument);
        return;
    } else if(process.argv.length > 2 && process.argv.length == 4){
        try {
            runManual(Number.parseInt(process.argv[3]) + "");
            return;
        } catch (err) {
            console.log(invalidArgumentManual);
            return;
        }
    }
    runNormal()
}

function createDir() {
    if (fs.existsSync(process.execPath + "/discordUpdater")) return;
    mkdir(process.env.HOME + "/discordUpdater/", {recursive: true}, (err) => {
        if (err) {
            console.log("Error creating working directory: " + err);
        } else {
            console.log("+Created working directory in: " + process.env.HOME + "/discordUpdater/");
        }
    });
}

function createFile() {
    if (!fs.existsSync(process.env.HOME + "/discordUpdater/config.json")) {
        createDir()
    }
    if (!fs.existsSync(process.env.HOME + "/discordUpdater/config.json")) {
        fs.writeFileSync(process.env.HOME + "/discordUpdater/config.json", JSON.stringify({
            path: fallbackPath,
            discordLink: discordLink
        }));
    }
}

function loadFile() {
    if (!fs.existsSync(process.env.HOME + "/discordUpdater/config.json")) {
        createFile();
    }
    const l: Config = JSON.parse(fs.readFileSync(process.env.HOME + "/discordUpdater/config.json", 'utf8'));
    path = l.path;
    discordLink = l.discordLink;
    return l;
}

async function runNormal() {
    console.log("--------DISCORD UPDATER--------")
    let ver = await getNextWebVersion() + "";
    if(!fs.existsSync(process.env.HOME + "/discordUpdater/discord-0.0." + ver + ".deb")) {
        console.log("-Getting new Version: " + ver)
        const re = await util.fetchFile((discordLink.replace("%s", ver).replace("%s", ver)), process.env.HOME + "/discordUpdater", `discord-0.0.${ver}.deb`);
        re.on('finish', () => {
            console.log("+Finished Getting new Version: " + ver + "")
            console.log("-Removing old Version")
            util.removeOld().then((value) => {
                value.on('exit', (code) => {
                    console.log("+Finished removing old Version")
                    console.log("-Installing new Version")
                    util.installNew(ver).then(async (value) => {
                        value.on('exit', (code) => {
                            console.log("+Finished installing new Version")
                            console.log("-Removing deb")
                            util.removeDeb(ver).then((value) => {
                                value.on('exit', (code) => {
                                    console.log("+Finished removing deb")
                                    console.log("--------DISCORD UPDATER--------")
                                    process.kill(process.pid, 'SIGTERM');
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {
        console.log("-Removing old Version")
        await util.removeOld().then((value) => {
            value.on('exit', (code) => {
                console.log("+Finished removing old Version")
                console.log("-Installing new Version")
                util.installNew(ver).then(async (value) => {
                    value.on('exit', (code) => {
                        console.log("+Finished installing new Version")
                        console.log("-Removing deb")
                        util.removeDeb(ver).then((value) => {
                            value.on('exit', (code) => {
                                console.log("+Finished removing deb")
                                console.log("--------DISCORD UPDATER--------")
                                process.kill(process.pid, 'SIGTERM');
                            });
                        });
                    });
                });
            });
        });
    }
}

async function runManual(ver : string) {
    if(!fs.existsSync(process.env.HOME + "/discordUpdater/discord-0.0." + ver + ".deb")) {
        console.log("-Getting new Version: " + ver)
        const re = await util.fetchFile((discordLink.replace("%s", ver).replace("%s", ver)), process.env.HOME + "/discordUpdater", `discord-0.0.${ver}.deb`);
        re.on('finish', () => {
            console.log("+Finished Getting new Version: " + ver + "")
            console.log("-Removing old Version")
            util.removeOld().then((value) => {
                value.on('exit', (code) => {
                    console.log("+Finished removing old Version")
                    console.log("-Installing new Version")
                    util.installNew(ver).then(async (value) => {
                        value.on('exit', (code) => {
                            console.log("+Finished installing new Version")
                            console.log("-Removing deb")
                            util.removeDeb(ver).then((value) => {
                                value.on('exit', (code) => {
                                    console.log("+Finished removing deb")
                                    console.log("--------DISCORD UPDATER--------")
                                    process.kill(process.pid, 'SIGTERM');
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {
        console.log("-Removing old Version")
        await util.removeOld().then((value) => {
            value.on('exit', (code) => {
                console.log("+Finished removing old Version")
                console.log("-Installing new Version")
                util.installNew(ver).then(async (value) => {
                    value.on('exit', (code) => {
                        console.log("+Finished installing new Version")
                        console.log("-Removing deb")
                        util.removeDeb(ver).then((value) => {
                            value.on('exit', (code) => {
                                console.log("+Finished removing deb")
                                console.log("--------DISCORD UPDATER--------")
                                process.kill(process.pid, 'SIGTERM');
                            });
                        });
                    });
                });
            });
        });
    }
}

async function getCurrentVersion() {
    let data : string[];
    try {
        data = fs.readdirSync(`/home/${process.env.USER}/.config/discord/`, 'utf8');
    } catch (err) {
        console.log("Error listing dir: " + err);
        return;
    }
    let outputData : string;
    data.forEach((value) => {
        let containedDots : number;
        if(value.startsWith("0")) {
            containedDots = value.split(".").length;
            if(containedDots == 3) {
                outputData = value;
            }
        }
    });
    return outputData;
}

async function getCurrentWebVersion() {
    const ver = await getCurrentVersion();
    return Number.parseInt(ver.substring(4, 6));
}

async function getNextWebVersion() {
    const ver = await getCurrentWebVersion();
    return ver + 1;
}
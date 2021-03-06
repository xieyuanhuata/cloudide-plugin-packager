/********************************************************************************
 * Copyright (C) 2020. Huawei Technologies Co., Ltd. All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import * as fs from "fs";
import * as path from "path";
import * as archiver from "archiver";

export async function zip(files: string[], zipPath: string, pluginRootFolder: string) {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', function() {
        console.log('✔️  Packing completed: ' + zipPath + `\n If you have any problems during the process, please create an issue on github.
        (https://github.com/huaweicloud/cloudide-plugin-packager/issues/new)`);
    });

    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            console.error(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    files.forEach((file) => {
        archive.file(file, { name: path.relative(pluginRootFolder, file) });
    });

    archive.finalize();
}

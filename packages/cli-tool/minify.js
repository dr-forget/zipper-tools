const { minify } = require("terser");

const path = require("path");

const fs = require("fs");

const globFast = require("fast-glob");

const filejs = globFast.sync(["lib/**/*.js"], { dot: true });

(async () => {
  for (let i = 0; i < filejs.length; i++) {
    const file = filejs[i];
    const absolutePath = path.resolve(file);
    const code = fs.readFileSync(absolutePath, "utf8");
    const result = await minify(code, {
      compress: true,
      mangle: true,
      keep_fnames: true,
      toplevel: true,
    });
    fs.writeFileSync(absolutePath.replace('js','mjs'), result.code, "utf8");
    fs.unlinkSync(absolutePath)
  }
})();

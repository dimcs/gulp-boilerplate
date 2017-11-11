# gulp-boilerplate

#### Installation

1. Install this code on your local system
 
    **Option 1 (recommended)**
    
    1. Fork this repository (see top right corner)
    2. Clone the forked repository on your local file system
    
        ```
        cd /path/to/install/location
        
        git clone git@github.com:[your_username]/vuejs-cinema.git
        ```
    
    **Option 2 (easier)**
    
    This option is better if you're not a Github user or are not sure how to setup SSH keys
    
    ```
    cd /path/to/install/location
    
    git clone https://github.com/vuejsdevelopers/vuejs-cinema.git
    ```    
   
2. Install dependencies

    ```
    npm i -D gulp gulp-jade babel-preset-es2015 gulp-sass gulp-combine-mq gulp-minify-css gulp-rigger gulp-babel gulp-uglify gulp-autoprefixer gulp-imagemin gulp.spritesmith gulp-html-replace multipipe gulp-sourcemaps gulp-cache gulp-rename gulp-clean gulp-newer gulp-if gulp-concat merge-stream gulp-connect-multi gulp-notify gulp-size run-sequence gulp-zip
    ```
    
3. Start project

    ```
    npm start
    ```   

#### Commands

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="22%"><code>npm i</code></td>
      <td>Install dependencies</td>
    </tr>
    <tr>
      <td><code>gulp</code></td>
      <td>Project assembly</td>
    </tr>
    <tr>
      <td><code>gulp watch</code></td>
      <td>Run the build, server, and file tracking</td>
    </tr>
    <tr>
      <td><code>NODE_ENV=production npm start build</code></td>
      <td>Will lead to assembly without sourcemaps and minify files</td>
    </tr>
  </tbody>
</table>
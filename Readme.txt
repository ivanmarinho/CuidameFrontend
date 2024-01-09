-> Generate android studio files 

ionic capacitor copy android
ionic capacitor sync android

-> First time that you copy the android folder to the android studio workspace

-> Generate web server files 
ionic build --prod

-> Deployment web server application

ionic capacitor copy ios

ionic capacitor build iOS --prod --release

ionic capacitor build ios --prod --buildFlag="-UseModernBuildSystem=0"

ionic capacitor platform update ios
ionic capacitor add ios

// Seleccionar el team

ionic capacitor build ios --prod

npx cap add ios 
npx cap sync


-> Generate android studio files 

ionic capacitor copy android
ionic capacitor sync android

-> First time that you copy the android folder to the android studio workspace

-> Generate web server files 
ionic build --prod

-> Deployment web server application

npx cap add ios  // Create ios folder

npx cap sync ios // Sync ios folder to get the last version

npx cap open ios
or
open ios/App/App.xcworkspace

In case you don't have cocoapods installed!

Step: 1
Install brew

1. curl -fsSL -o install.sh https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh
2. /bin/bash install.sh
Step 2:

brew install chruby ruby-install


(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> /Users/lvinazco/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

Step 3:

brew install cocoapods
Step 4: (Check your cocoapods version):

brew upgrade cocoapods



// icons 

npm install -g cordova-res
cordova-res android --skip-config --copy


// Create components

ionic g component pages/help/contactus

ionic cordova plugin add cordova-plugin-inappbrowser
npm install @awesome-cordova-plugins/in-app-browser

npm install @capacitor/browser
npx cap sync


ionic generate page pages
ng g module pages/pets/yyy --routing



ionic g page pages/user-account/update-user
ionic g page pages/pets/pets-pages/select-service
ionic g page pages/health-care-options

ng g module pages/pets/user-account --routing


ionic generate component maps/mapsModal


npm install --save-dev @types/googlemaps --force
npm install @angular/google-maps --force
npm i @capacitor-community/capacitor-googlemaps-native --force
npm install @capacitor/google-maps --force


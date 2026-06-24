const { withDangerousMods } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

// AppCheckCore (pulled in by GoogleSignIn 9.x) is a Swift pod that requires
// GoogleUtilities and RecaptchaInterop to have modular headers enabled when
// building as static libraries. Without this the pod install step fails.
module.exports = (config) =>
  withDangerousMods(config, [
    [
      'ios',
      (config) => {
        const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
        let podfile = fs.readFileSync(podfilePath, 'utf-8');
        podfile = mergeContents({
          tag: 'withModularHeaders',
          src: podfile,
          newSrc: [
            "pod 'GoogleUtilities', :modular_headers => true",
            "pod 'RecaptchaInterop', :modular_headers => true",
          ].join('\n'),
          anchor: /^target .+ do/m,
          offset: 0,
          comment: '#',
        }).contents;
        fs.writeFileSync(podfilePath, podfile);
        return config;
      },
    ],
  ]);

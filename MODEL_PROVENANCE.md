# Dependency provenance

Downloaded for this revision on 2026-10-31. Runtime app requests use local paths only.

- face-api.js version 0.22.2: https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js
- Model manifests and shards: https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/
- Library license copied from https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/LICENSE into vendor/LICENSE-face-api.txt

Model families: tiny_face_detector_model, face_landmark_68_model, face_recognition_model. All paths named in the three manifests are included. Manifest tensor dimensions and quantized element sizes were checked against shard byte sizes. This is a completeness check, not cryptographic attestation by an upstream publisher. SHA256SUMS.txt records the bytes distributed here because the upstream master branch can change.

The library license is MIT. The application includes no new participant faces or descriptors. Model training-data provenance and any additional obligations should be reviewed before public redistribution or institutional deployment; inclusion of the library license is not a claim that all training-data rights have been independently audited. No license for the authors' application or manuscript is invented by this revision.

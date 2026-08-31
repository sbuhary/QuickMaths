# QuickMaths TensorFlow.js Digit Model

QuickMaths loads a browser-only TensorFlow.js digit model from this folder:

```js
tf.loadLayersModel("./model/model.json")
```

No backend server, Python API, or cloud API is required at runtime. The browser downloads `model.json` and the `.bin` shard files as static GitHub Pages assets.

## Prepare A Model

1. Train or download an EMNIST/MNIST/math-symbol Keras model that classifies digits `0` through `9`.
2. Install the converter locally:

```bash
pip install tensorflowjs
```

3. Convert a Keras model:

```bash
tensorflowjs_converter --input_format=keras path/to/digit_model.keras ./model
```

Or convert a TensorFlow SavedModel:

```bash
tensorflowjs_converter --input_format=tf_saved_model path/to/saved_model ./model
```

4. Commit the generated `model/model.json` and shard `.bin` files.
5. Enable the browser loader after those files exist. QuickMaths already does this in `index.html`:

```html
<script>
  window.QUICKMATHS_ENABLE_TF_MODEL = true;
</script>
```

## Expected Input/Output

The preprocessing sends raw `0-255` grayscale pixel values. The app supports the included flat `[1, 784]` model and future CNN-style `[1, 28, 28, 1]` models. The model should return 10 probabilities in digit order: `0, 1, 2, 3, 4, 5, 6, 7, 8, 9`.

QuickMaths still uses rule-based checks as a guard so a low-confidence model guess does not automatically award stars.
## Included Model

The committed model files are copied from Google's archived `tfjs-mnist-workshop` model directory, which provides a static TensorFlow.js MNIST model. It is small and mobile-friendly, and it replaces the brittle template-only path. MNIST is still adult-written centered digit data, so for best kid handwriting quality, replace these files later with an EMNIST or child-sample-trained model using the same filenames.

The upstream Apache-2.0 license is included in `model/LICENSE`.
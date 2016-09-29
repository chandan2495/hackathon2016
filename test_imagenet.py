
# import the necessary packages
from keras.preprocessing import image as image_utils
from imagenet_utils import decode_predictions
from imagenet_utils import preprocess_input
from vgg16 import VGG16
import numpy as np
import argparse
import time


model = VGG16(weights="imagenet")

def classify_image(image_arg):
	print("[INFO] loading and preprocessing image...")
	image = image_utils.load_img(image_arg, target_size=(224, 224))
	image = image_utils.img_to_array(image)

	# our image is now represented by a NumPy array of shape (3, 224, 224),
	# but we need to expand the dimensions to be (1, 3, 224, 224) so we can
	# pass it through the network -- we'll also preprocess the image by
	# subtracting the mean RGB pixel intensity from the ImageNet dataset
	image = np.expand_dims(image, axis=0)
	image = preprocess_input(image)

	# load the VGG16 network
	# print("[INFO] loading network...")	
	# classify the image
	# print("[INFO] classifying image...")
	preds = model.predict(image,32,1)
	preds=preds.reshape(1000)
	#(inID, label) = decode_predictions(preds)[0]
	top_pred,out_label_probs = decode_predictions(preds)

	# print "Top predictions : "
	# print "Label : {}, Probability: {}".format(top_pred['label'],top_pred['prob'])

	# print "Top labels with proobabilites : "
	# for label in out_label_probs:
	# 	print "Label : {}, Probability: {}".format(label['label'],label['prob'])
	return top_pred, out_label_probs

def test_classify_with_args():
	# construct the argument parse and parse the arguments
	ap = argparse.ArgumentParser()
	ap.add_argument("-i", "--image", required=True,
		help="path to the input image")
	args = vars(ap.parse_args())
	classify_image(args['image'])

# test_classify_with_args()


from test_imagenet import classify_image
import os
import sys

sys.path.insert(0, 'Scrapbook/python_scripts')
import superclass as sc

image_extensions = ["jpg", "jpeg", "png", "bmp"]
album_superclass_map = {
	'animal' : 'Animal',
	'person' : 'Person',
	'location' : 'Places',
	'vehicle' : 'Vehicles',
	'sport' : 'Sports',
	'geological_formation' : 'Outdoor',
	'musical_instrument' : 'Musical Instruments',
	'plant' : 'Nature',
	'electronic_equipment' : 'Electronic Gadgets',
	'misc' : 'Miscellaneous',
}

def classify_folder(dirpath):
	for image in os.listdir(dirpath):		
		if image.split(".")[-1] in image_extensions:
			print image
			top_pred, out_label_preds= classify_image(dirpath + "\\"+ image)
			print 'Image : {} , Label : {}'.format(image,top_pred['label'][1])
			print 'Superclass : ', sc.getSuperClass(top_pred['label'][1])

classify_folder('G:\Hackathon\deep-learning-models\images\\awsome')
from test_imagenet import classify_image
import os
import sys

sys.path.insert(0, 'Scrapbook/python_scripts')
import superclass as sc
import sqlReader as sr

PATH_TO_DB = os.path.dirname(os.path.abspath(__file__)) + "\\scrapbook.db"
saveDb = sr.SQLReader()
image_extensions = ["jpg", "jpeg", "png", "bmp"]
album_superclass_map = {
	'animal' : 'Animal',
	'person' : 'Person',
	'location' : 'Places',
	'vehicle' : 'Vehicles',
	'sport' : 'Sports',
	'geological_formation' : 'Outdoors',
	'musical_instrument' : 'Musical Instruments',
	'plant' : 'Nature',
	'electronic_equipment' : 'Electronic Gadgets',
	'misc' : 'Miscellaneous',
}
def create_db():	
	try:
		if not os.path.isfile(PATH_TO_DB):
			saveDb.create_db(PATH_TO_DB)
	except Exception as e:
		print e

def classify_folder(dirpath):
	os.chdir(dirpath)
	images = []
	for image in os.listdir(dirpath):		
		if image.split(".")[-1] in image_extensions:
			image_dict=dict()			
			print image
			top_pred, out_label_preds= classify_image(dirpath + "\\"+ image)
			print 'Image : {} , Label : {}'.format(image,top_pred['label'][1])
			category = sc.getSuperClass(top_pred['label'][1])
			top_pred['superclass'] = category
			print 'Superclass : ', sc.getSuperClass(top_pred['label'][1])
			if not os.path.exists(album_superclass_map[category]):
				print 'Creating new album : ',album_superclass_map[category]
				os.makedirs(album_superclass_map[category])
			os.rename(image,album_superclass_map[category]+"//"+image)
			# creating db data
			image_dict['image'] = dirpath + '\\' + image
			image_dict['labels'] = out_label_preds
			image_dict['top_pred'] = top_pred
			images.append(image_dict)

	save_data_to_db(top_pred,out_label_preds,images, dirpath)

def save_data_to_db(top_pred, out_label_preds, images, dirpath):
	# insert data to albums table (path, album_name) and images table	
	print saveDb.insertToDb(dirpath.split('\\')[-1], dirpath, images, PATH_TO_DB)

create_db()
classify_folder('G:\Hackathon\deep-learning-models\images\\awsome')
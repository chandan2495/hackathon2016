import time
import urllib
download="https://source.unsplash.com/category/people/1920x1080"
count=1
while count<11:
	path="images\\awsome\\"
	urllib.urlretrieve(download,path+ "people" +str(count)+".jpg")
	print 'Downloaded : {}.jpg'.format(count)
	count+=1
import sqlite3 as sql
import json

def create_db():
	sqlite_file = "scrapbook.db"
	table_images = "images"

	field_name = "image_name"
	field_path = "image_path"
	field_superclass = "superclass"
	field_tags = "tags"
	field_id = "id"

	query = "CREATE TABLE {} ({} INTEGER PRIMARY KEY, {} TEXT, {} TEXT, {} TEXT, {} TEXT)".format(
		table_images, field_id, field_name, field_path, field_superclass, field_tags)

	conn = sql.connect(sqlite_file)
	c = conn.cursor()

	c.execute(query)

def getJSONFromSql():
	return json.dumps({})

if __name__ == "__main__":
	create_db()
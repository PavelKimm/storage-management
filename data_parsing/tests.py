from django.test import TestCase


import os
from xml.etree import ElementTree

directory = '/Users/pavel/Desktop/PyCharmProjects/storage_management_1C/1c_data/data_dump/Data'

for filename in os.listdir(directory):
    if filename.endswith(".xml"):
        # parse an xml file by name
        xml_file = ElementTree.parse(directory + '/' + filename)
        root_element = xml_file.getroot()
        for dump_element in root_element:
            if dump_element.tag != "DumpElement":
                print("Not DumpElement!!!")
                print(f"Filename: {filename}")
                continue

            # for catalog_object__product in dump_element:
            #     db_object = {}
            #
            #     if catalog_object__product.tag.endswith('CatalogObject.Номенклатура'):
            #         for product_info_row in catalog_object__product:
            #
            #             if product_info_row.tag.endswith('IsFolder'):
            #                 if product_info_row.text == 'true':
            #                     is_folder = True
            #                 else:
            #                     is_folder = False
            #                 db_object['is_folder'] = is_folder
            #
            #             if product_info_row.tag.endswith('Ref'):
            #                 ref = product_info_row.text
            #                 db_object['ref'] = ref
            #
            #             if product_info_row.tag.endswith('Description'):
            #                 description = product_info_row.text
            #                 db_object['description'] = description
            #
            #             if product_info_row.tag.endswith('Parent') and db_object['is_folder'] is False:
            #                 db_object['category_ref'] = product_info_row.text
            #
            #         print(db_object)









            # for tmz in dump_element:
            #     print(tmz.tag)


        # print(len(root_element))
        # print(root_element[0])

        # print(root_element.attrib)
        # try:
        #     for x in root_element:
        #         print(x[0].tag, x[0].attrib)
        # except:
        #     pass
# print(x_)
        # try:
        #     print(root_element[0])
        # except:
        #     pass
        # exit()
        # print(root_element.get('DumpElement'))

        # one specific item attribute
        # try:
        #     print(items[0].attributes['DumpElement'])
        # except:
        #     print(3)

        # # all item attributes
        # print('\nAll attributes:')
        # for elem in items:
        #     print(elem.attributes['name'].value)
        #
        # # one specific item's data
        # print('\nItem #2 data:')
        # print(items[1].firstChild.data)
        # print(items[1].childNodes[0].data)
        #
        # # all items data
        # print('\nAll item data:')
        # for elem in items:
        #     print(elem.firstChild.data)

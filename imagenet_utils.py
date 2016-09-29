import numpy as np
import json

from keras.utils.data_utils import get_file
from keras import backend as K

CLASS_INDEX = None
CLASS_INDEX_PATH = 'https://s3.amazonaws.com/deep-learning-models/image-models/imagenet_class_index.json'


def preprocess_input(x, dim_ordering='default'):
    if dim_ordering == 'default':
        dim_ordering = K.image_dim_ordering()
    assert dim_ordering in {'tf', 'th'}

    if dim_ordering == 'th':
        x[:, 0, :, :] -= 103.939
        x[:, 1, :, :] -= 116.779
        x[:, 2, :, :] -= 123.68
        # 'RGB'->'BGR'
        x = x[:, ::-1, :, :]
    else:
        x[:, :, :, 0] -= 103.939
        x[:, :, :, 1] -= 116.779
        x[:, :, :, 2] -= 123.68
        # 'RGB'->'BGR'
        x = x[:, :, :, ::-1]
    return x


def decode_predictions(preds):
    global CLASS_INDEX
    deltaValue = 5e-09
    #assert len(preds.shape) == 2 and preds.shape[1] == 1000
    if CLASS_INDEX is None:
        fpath = get_file('imagenet_class_index.json',
                         CLASS_INDEX_PATH,
                         cache_subdir='models')
        CLASS_INDEX = json.load(open(fpath))
    #  get the top prediction
    top_pred = dict()
    top_index = np.argmax(preds, axis=-1)
    top_pred['label'] = CLASS_INDEX[str(top_index)]
    top_pred['prob'] = preds[top_index]

    # get all the labels with probability greater than 0.5
    # indices = np.argpartition(preds, -4)[-4:]
    # print indices
    # new_preds = preds[indices]    
    # new_preds.sort()
    # new_preds = new_preds[::-1]
    preds_dict = { idx: prob for idx,prob in enumerate(preds)}
    out_label_probs = []
    for idx,prob in preds_dict.items():
        if prob>0.5:
            label_prob = dict()
            label_prob['label'] = CLASS_INDEX[str(idx)]
            label_prob['prob'] = prob
            out_label_probs.append(label_prob)
    # results = []
    # for i in indices:
    #     results.append(CLASS_INDEX[str(i)])
    # return CLASS_INDEX[str(top_pred)],results
    return top_pred,out_label_probs

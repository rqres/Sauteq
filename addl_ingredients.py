# Ingredient Database Management

import pandas as pd

raw_ingredients = 'Agar agar, Almond extract, Almond flour, Alligator, All-purpose flour, Adzuki beans, Amarula liqueur, Anchovies, Anise seeds, Apple, Apple mint, Apricot, Arborio rice, Arrowroot powder, Artichoke, Arugula, Asparagus, Avocado, Bacon, Bamboo shoots, Banana, Basmati rice, Basil, Bay leaves, Beef, Bell pepper, Bergamot, Black-eyed peas, Blackberries, Black mustard seeds, Black pepper, Black rice, Black salt (kala namak), Black truffle, Blueberries, Bok choy, Bread flour, Broccoli, Brussels sprouts, Buddha\'s hand, Buffalo, Brown rice, Brie, Butter beans, Butter lettuce, Butternut squash, Cabbage, Cacao powder, Calrose rice, Camembert, Cannellini beans, Cantaloupe, Capers, Cardamom, Carob powder, Carrot, Cassava, Cauliflower, Cayenne pepper, Celery, Celery salt, Chayote, Cheddar cheese, Cherry, Chickpea flour, Chickpeas (garbanzo beans), Chicken, Chives, Cilantro, Cilantro root, Cinnamon, Cinnamon basil, Clams, Cloves, Coconut flour, Coconut milk, Coconut oil, Collard greens, Collard greens, Beet greens, Dandelion greens, Watercress, Arugula, Radicchio, Endive, Mâche (Lamb\'s lettuce), Mizuna, Tatsoi, Bok choy, Chicory, Escarole, Frisée, Mustard greens, Sorrel, Turnip greens, Amaranth leaves, Malabar spinach, Canned asparagus, Canned artichoke hearts, Canned bamboo shoots, Canned beets, Canned black beans, Canned carrots, Canned chickpeas (garbanzo beans), Canned corn, Canned diced tomatoes, Canned green beans, Canned green lentils, Canned kidney beans, Canned lentils, Canned lima beans, Canned mixed vegetables, Canned mushrooms, Canned peas, Canned pinto beans, Canned sliced mushrooms, Canned spinach, Canned water chestnuts, Corn, Cornstarch, Crab, Cranberries, Cream cheese, Cottage cheese, Cucumber, Cumin, Curry powder, Dandelion greens, Dates, Deer, Dragonfruit, Duck, Durian, Eggplant, Elderberries, Elk, Endive, Escargot, Escarole, Fennel seeds, Feta cheese, Figs, Finger lime, Fish sauce, Flounder, Forbidden rice, Fontina, Garlic, Gelatin, Ginger, Goat, Gorgonzola, Goose, Gouda, Gruyère, Grape leaves, Grapefruit, Grapes, Greek basil, Green beans, Ground pork, Grouper, Guava, Havarti, Halibut, Ham, Haddock, Hazelnut, Havarti, Hearts of palm, Honeydew melon, Hot dogs, Hummus, Jasmine rice, Jalapeño, Jicama, Kale, Kangaroo, Kaffir lime leaves, Kaffir lime zest, Key lime, Kiwi, Kohlrabi, Komatsuna, Kosher salt, Lamb, Lemongrass, Lemon, Lemon balm, Lemon basil, Lemon grass, Lemon mint, Lemon pepper, Lemon thyme, Lemon verbena, Lemon zest, Lettuce, Lime, Lime basil, Lime leaves, Lime mint, Lime zest, Lingonberries, Lobster, Mahi-mahi, Malanga, Mango, Marjoram, Melon, Monterey Jack, Mussels, Mustard greens, Mustard seeds, Nectarine, Nigella seeds, Nutmeg, Nutritional yeast, Octopus, Olive oil, Onion, Onion salt, Orange, Orange blossom water, Orange extract, Orange marmalade, Orange mint, Orange zest, Oregano, Ostrich, Papaya, Paprika, Parmesan cheese, Parsley, Parsnip, Passion flower, Passion fruit, Peach, Pear, Peas, Pecan, Pheasant, Pickling salt, Pineapple, Pink peppercorns, Plantain, Plum, Pomegranate, Poppy seeds, Pork, Portobello mushrooms, Potato, Pumpkin, Purple basil, Queso fresco, Quail, Quail eggs, Quinoa, Raclette, Raisins, Raspberry, Red beans, Red pepper, Red rice, Ricotta, Rice flour, Roquefort, Rock salt, Rosemary, Rutabaga, Safflower oil, Saffron, Sage, Salmon, Salt, Sardines, Scallions, Stilton, Sea bass, Sea salt, Seaweed, Sesame oil, Sesame seeds, Shallot, Shrimp, Snapper, Sorrel, Soy sauce, Spinach, Squid, Star fruit, Strawberries, Sunflower seeds, Sushi rice, Sweet basil, Sweet potato, Swordfish, Swiss chard, Tangerine, Tapenade, Tapioca starch, Thyme, Tomato, Tongue, Tripe, Trout, Tuna, Turnip, Turkey, Ugli fruit, Vanilla extract, Venison, Walnuts, Water chestnut, Watercress, Watermelon, White pepper, Whole wheat flour, Wild rice, Xanthan gum, Yams, Yellow squash, Yuzu, Zucchini'

ingredients_list = [ing.strip() for ing in str.split(raw_ingredients.upper(), ',')]

# Create a dictionary with the data
dict = {
    'name_en_myfood': ingredients_list,
    'usda_id': list(range(10040, 10040 + len(ingredients_list)))
}

addl_df = pd.DataFrame(dict)



df = pd.read_csv('https://query.data.world/s/75mjlnoyjgcynleu5w43e5wy4gnt6p?dws=00000', sep='\t')

relevant_cols = ['usda_id','name_en_myfood']
english_ingredients = df[relevant_cols].copy()
# print(f'before: \n {english_ingredients.head()}')
# print(f'before: \n {english_ingredients.shape}')

# dropping all ingredients that have a missing english name
english_ingredients.dropna(subset=['name_en_myfood'], inplace=True)


merged_df = pd.merge(english_ingredients, addl_df, on='name_en_myfood', how='outer')
print(f'Initial ingredients shape: {english_ingredients.shape}')
print(f'Addl ingredients shape: {addl_df.shape}')
print(f'Merged ingredients shape: {merged_df.shape}')

merged_df['UsdaId'] = merged_df['usda_id_x'].fillna(merged_df['usda_id_y']).astype(int)
merged_df['name'] = merged_df['name_en_myfood']
# Drop the unnecessary columns
merged_df.drop(columns=['usda_id_x', 'usda_id_y', 'name_en_myfood'], inplace=True)

print(merged_df.tail())

merged_df.sort_values(by=['UsdaId'], inplace=True)

overlapping_food_names = merged_df[merged_df.duplicated(subset='name')]['name'].tolist()
overlapping_food_ids = merged_df[merged_df.duplicated(subset='UsdaId')]['UsdaId'].tolist()
print("Overlapping food ids:", overlapping_food_ids)
# merged_df.to_json('english_ingredients.json',orient='table' ,index=False)
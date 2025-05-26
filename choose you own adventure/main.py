from dataclasses import dataclass
from typing import Dict
from dataclasses import field

@dataclass
class Page:
    story: str = ""
    choices: Dict[str, str] = field(default_factory=dict)

class Book:
    def __init__(self, pages, start_page):
        self.pages = pages
        self.start_page = start_page

    def read_page(self, page_name):
        page = self.pages[page_name]
        print(page.story)
        print()
        if page.choices:
            choices = ', '.join(page.choices.keys())
            print(f'What do you do? (Type one of the following: [{choices}])')
            user_choice = input('> ')
            while user_choice not in page.choices:
                print('Invalid choice. Try again.')
                user_choice = input('> ')
            return user_choice
        else:
            return None
    
    def read_book(self):
        current_page = self.start_page
        while current_page:
            print("\n\n==================================================================\n\n")
            current_page = self.read_page(current_page)
            

# this is 5 Nights at Freddy's themed
short_freddie_pages = {
    'start': Page(
        story='You are a security guard at Freddy Fazbear\'s Pizza. You are working the night shift. You hear a noise coming from the kitchen. What do you do? Do you look at the cameras, or close the doors?',
        choices={'cameras': 'cameras', 'doors': 'doors'}
    ),
    'cameras': Page(
        story='You look at the cameras and see that the animatronics are moving. After looking for a while, you think it\'s safe to look up, but standing in front of you is Freddy Fazbear. He eats you. Game over.',
    ),
    'doors': Page(
        story='You close the doors just in time. Bonnie and Chica are trying to get in but they can\'t. You are safe. And you hear the clock strike 6. You survived the night. You win!',
    ),
}

bo_pages = {
    'start': Page(
        story='You find yourself in a brightly colored room filled with balloons and confetti. The walls are adorned with circus posters, and the air smells of popcorn and cotton candy. To your left, there is a door painted with vibrant stripes, and to your right, a window with a clown face peeking through. What do you do?', 
        choices={'door': 'door', 'window': 'window'}
    ),
    'door': Page(
        story='You open the door and step into a long hallway lined with funhouse mirrors. The reflections warp and twist, making you laugh and feel uneasy at the same time. At the end of the hallway, you see a flickering neon sign that reads "Fun Ahead". What do you do?',
        choices={'walk': 'walk', 'stay': 'stay'}
    ),
    'window': Page(
        story='You open the window and a gust of fresh air rushes in, carrying the sound of carnival music. Below, you see a whimsical garden filled with oversized flowers and a path leading to a giant circus tent. The garden looks inviting, but the tent holds the promise of more fun. What do you do?',
        choices={'walk': 'walk', 'stay': 'stay'}
    ),
    'walk': Page(
        story='You decide to walk down the hallway, your footsteps echoing with a squeaky sound. The path soon splits into two, each route filled with colorful lights and laughter. To the left, the path is lined with juggling clowns, while to the right, it is filled with acrobats performing daring feats. Each direction promises excitement and surprises. What do you do?',
        choices={'left': 'left', 'right': 'right'}
    ),
    'stay': Page(
        story='You choose to stay put, hoping to enjoy the moment. Suddenly, a loud honking noise breaks the silence. You turn around to find a giant clown with a mischievous grin, holding a cream pie. Before you can react, the pie hits you square in the face. Game over.',
    ),
    'left': Page(
        story='You take the left path, laughing as the clowns juggle and perform tricks. Suddenly, one of the clowns pulls out a water squirter and sprays you with a jet of water. You slip and fall into a pool of confetti. Game over.',
    ),
    'right': Page(
        story='You choose the right path, marveling at the acrobats as they flip and soar through the air. The path leads you to a large treasure chest decorated with glitter and sparkles. You open it with excitement to find a golden ticket inside. You win!',
    ),     
}


book = Book(bo_pages, 'start')
book.read_book()
import pygame
import sys
import random
import csv
import time

pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 800, 600
TILE_SIZE = 40

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (0, 0, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)

# Load maze from CSV file
def load_maze_from_csv(filename):
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile)
        return [[int(cell) for cell in row] for row in reader]

# Initialize the first maze
current_maze_number = 1
maze = load_maze_from_csv(f'mazes/maze{current_maze_number}.csv')

# Player position
player_pos = [1, 1]

# Monster positions
monster_pos = [11, 18]
blind_monster_pos = [5, 5]

# Movement counters
monster_move_counter = 0
blind_monster_move_counter = 0
MONSTER_MOVE_DELAY = 60  # Increased from 30 to 60 to make the monster move slower
BLIND_MONSTER_MOVE_DELAY = 60  # Increased from 30 to 60 to make the blind monster move slower

# Create the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Maze Game")

# Font for messages
font = pygame.font.SysFont(None, 55)

def draw_maze():
    for row in range(len(maze)):
        for col in range(len(maze[row])):
            if maze[row][col] == 1:
                color = BLACK
            elif maze[row][col] == 2:
                color = RED
            else:
                color = WHITE
            pygame.draw.rect(screen, color, (col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def draw_player():
    pygame.draw.rect(screen, BLUE, (player_pos[1] * TILE_SIZE, player_pos[0] * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def draw_monster():
    pygame.draw.rect(screen, GREEN, (monster_pos[1] * TILE_SIZE, monster_pos[0] * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def draw_blind_monster():
    pygame.draw.rect(screen, YELLOW, (blind_monster_pos[1] * TILE_SIZE, blind_monster_pos[0] * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def move_player(dx, dy):
    new_x = player_pos[0] + dx
    new_y = player_pos[1] + dy
    if maze[new_x][new_y] == 0 or maze[new_x][new_y] == 2:
        player_pos[0] = new_x
        player_pos[1] = new_y

def move_monster():
    # Simple AI to move the monster towards the player
    if monster_pos[0] < player_pos[0] and maze[monster_pos[0] + 1][monster_pos[1]] != 1:
        monster_pos[0] += 1
    elif monster_pos[0] > player_pos[0] and maze[monster_pos[0] - 1][monster_pos[1]] != 1:
        monster_pos[0] -= 1
    elif monster_pos[1] < player_pos[1] and maze[monster_pos[0]][monster_pos[1] + 1] != 1:
        monster_pos[1] += 1
    elif monster_pos[1] > player_pos[1] and maze[monster_pos[0]][monster_pos[1] - 1] != 1:
        monster_pos[1] -= 1

def move_blind_monster():
    # Random movement for the blind monster
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    random.shuffle(directions)
    for dx, dy in directions:
        new_x = blind_monster_pos[0] + dx
        new_y = blind_monster_pos[1] + dy
        if maze[new_x][new_y] == 0:
            blind_monster_pos[0] = new_x
            blind_monster_pos[1] = new_y
            break

def check_win():
    return maze[player_pos[0]][player_pos[1]] == 2

def check_game_over():
    return player_pos == monster_pos or player_pos == blind_monster_pos

def display_message(message, color):
    text = font.render(message, True, color)
    screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))

def load_next_maze():
    global current_maze_number, maze, player_pos, monster_pos, blind_monster_pos, won, game_over
    current_maze_number += 1
    try:
        maze = load_maze_from_csv(f'mazes/maze{current_maze_number}.csv')
        player_pos = [1, 1]
        monster_pos = [11, 18]
        blind_monster_pos = [5, 5]
        won = False
        game_over = False
    except FileNotFoundError:
        display_message("No more mazes!", (0, 0, 0))
        pygame.display.flip()
        time.sleep(5)
        pygame.quit()
        sys.exit()

# Main game loop
running = True
won = False
game_over = False
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN and not won and not game_over:
            if event.key == pygame.K_UP:
                move_player(-1, 0)
            elif event.key == pygame.K_DOWN:
                move_player(1, 0)
            elif event.key == pygame.K_LEFT:
                move_player(0, -1)
            elif event.key == pygame.K_RIGHT:
                move_player(0, 1)

    screen.fill(BLACK)
    draw_maze()
    draw_player()
    draw_monster()
    draw_blind_monster()
    
    if check_win():
        won = True
        display_message("You Win!", (0, 255, 0))
        pygame.display.flip()
        time.sleep(5)
        load_next_maze()
    elif check_game_over():
        game_over = True
        display_message("Game Over!", (255, 0, 0))
    else:
        # Move the monsters based on the counters
        if monster_move_counter >= MONSTER_MOVE_DELAY:
            move_monster()
            monster_move_counter = 0
        else:
            monster_move_counter += 1

        if blind_monster_move_counter >= BLIND_MONSTER_MOVE_DELAY:
            move_blind_monster()
            blind_monster_move_counter = 0
        else:
            blind_monster_move_counter += 1

    pygame.display.flip()

pygame.quit()
sys.exit()
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os
import logging

logger = logging.getLogger(__name__)


def generate_prisma_diagram():
    logger.debug("Starting PRISMA diagram generation")
    try:
        # Simulated database connection and data retrieval
        data = {
            'identification': 3163,
            'deduplication': {
                'duplicates_removed': 3163 - 654,
                'records_after_deduplication': 2333
            },
            'screening': {
                'selected_for_screening': 2509,
                'excluded': 2333
            },
            'eligibility': {
                'full_text_assessed': 176,
                'excluded': 35
            },
            'included': 141
        }

        # Create the figure and axis
        fig, ax = plt.subplots(figsize=(12, 10))
        ax.set_xlim(0, 3)
        ax.set_ylim(0, 6)
        ax.axis('off')

        # Function to create a box with text
        def create_box(x, y, width, height, text):
            rect = patches.Rectangle((x, y), width, height, fill=True, facecolor='lightblue', edgecolor='black')
            ax.add_patch(rect)
            ax.text(x + width/2, y + height/2, text, ha='center', va='center', wrap=True)

        # Add boxes
        create_box(0.5, 5, 1.5, 0.5, f"Records identified\n(n = {data['identification']})")
        create_box(0.5, 4, 1.5, 0.5, f"Records after deduplication\n(n = {data['deduplication']['records_after_deduplication']})")
        create_box(0.5, 3, 1.5, 0.5, f"Records screened\n(n = {data['screening']['selected_for_screening']})")
        create_box(0.5, 2, 1.5, 0.5, f"Full-text articles assessed\n(n = {data['eligibility']['full_text_assessed']})")
        create_box(0.5, 1, 1.5, 0.5, f"Studies included\n(n = {data['included']})")
        create_box(2.25, 4, 1, 0.5, f"Duplicates removed\n(n = {data['deduplication']['duplicates_removed']})")
        create_box(2.25, 3, 1, 0.5, f"Records excluded\n(n = {data['screening']['excluded']})")
        create_box(2.25, 2, 1, 0.5, f"Full-text articles excluded\n(n = {data['eligibility']['excluded']})")

        # Add arrows
        ax.arrow(1.25, 5, 0, -0.4, head_width=0.05, head_length=0.1, fc='k', ec='k')
        ax.arrow(1.25, 4, 0, -0.4, head_width=0.05, head_length=0.1, fc='k', ec='k')
        ax.arrow(1.25, 3, 0, -0.4, head_width=0.05, head_length=0.1, fc='k', ec='k')
        ax.arrow(1.25, 2, 0, -0.4, head_width=0.05, head_length=0.1, fc='k', ec='k')
        ax.arrow(2, 4.25, 0.15, 0, head_width=0.05, head_length=0.1, fc='k', ec='k')
        ax.arrow(2, 3.25, 0.15, 0, head_width=0.05, head_length=0.1, fc='k', ec='k')
        ax.arrow(2, 2.25, 0.15, 0, head_width=0.05, head_length=0.1, fc='k', ec='k')

        # Add tilted text on the left
        ax.text(0.1, 5.25, 'Identification', rotation=90, va='center', ha='center', fontweight='bold')
        ax.text(0.1, 4.25, 'Deduplication', rotation=90, va='center', ha='center', fontweight='bold')
        ax.text(0.1, 3.25, 'Screening', rotation=90, va='center', ha='center', fontweight='bold')
        ax.text(0.1, 2.25, 'Eligibility', rotation=90, va='center', ha='center', fontweight='bold')
        ax.text(0.1, 1.25, 'Included', rotation=90, va='center', ha='center', fontweight='bold')

        # Save the plot to a file
        output_folder = 'static'
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        output_path = os.path.join(output_folder, 'prisma_diagram.png')
        plt.savefig(output_path, format='png', dpi=300, bbox_inches='tight')

        plt.close(fig)

        logger.debug(f"PRISMA diagram saved to {output_path}")
        return output_path
    except Exception as e:
        logger.error(f"Error generating PRISMA diagram: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    generate_prisma_diagram()
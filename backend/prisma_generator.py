import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os
import logging

logger = logging.getLogger(__name__)


def generate_prisma_diagram(data):
    logger.debug("Starting PRISMA diagram generation")
    try:
        # Use the provided data
        identification = data['totalVolume']
        duplicates_removed = data['duplicates']
        records_after_deduplication = data['postDeduplication']
        full_text_assessed = data['hundredPercentMatch']
        excluded = records_after_deduplication - full_text_assessed
        included = full_text_assessed  # Assuming all full-text assessed are included

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
        create_box(0.5, 5, 1.5, 0.5, f"Records identified\n(n = {identification})")
        create_box(0.5, 4, 1.5, 0.5, f"Records after deduplication\n(n = {identification})")
        create_box(0.5, 3, 1.5, 0.5, f"Records screened\n(n = {records_after_deduplication})")
        create_box(0.5, 2, 1.5, 0.5, f"Full-text articles assessed\n(n = {full_text_assessed})")
        create_box(0.5, 1, 1.5, 0.5, f"Studies included\n(n = {included})")
        create_box(2.25, 4, 1, 0.5, f"Duplicates removed\n(n = {duplicates_removed})")
        create_box(2.25, 3, 1, 0.5, f"Records excluded\n(n = {excluded})")
        create_box(2.25, 2, 1, 0.5, f"Full-text articles excluded\n(n = 0)")  # Assuming all full-text assessed are included

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
    # Test data
    test_data = {
        'totalVolume': 1000,
        'pubmedVolume': 600,
        'semanticScholarVolume': 400,
        'duplicates': 100,
        'postDeduplication': 900,
        'hundredPercentMatch': 150
    }
    generate_prisma_diagram(test_data)

import 'dotenv/config';
import dataSource from '../../data-source';
import { Category } from '../../categories/category.entity';
import { Note } from '../../notes/note.entity';

const categoryNames = [
  'Product',
  'Engineering',
  'Personal',
  'Research',
  'Meetings',
];

const seedNotes = [
  {
    title: 'Q3 product launch checklist',
    content:
      'Finalize release notes, align support coverage, confirm analytics events, and prepare a short internal walkthrough for the launch week.',
    isArchived: false,
    categories: ['Product', 'Meetings'],
  },
  {
    title: 'Backend refactor follow-up',
    content:
      'Split the note service into smaller modules, add request-level validation tests, and review repository naming for consistency before the next sprint planning.',
    isArchived: false,
    categories: ['Engineering'],
  },
  {
    title: 'Articles to read on offline-first UX',
    content:
      'Compare caching strategies, sync conflict patterns, and user messaging approaches from Linear, Notion, and Basecamp.',
    isArchived: false,
    categories: ['Research', 'Product'],
  },
  {
    title: '1:1 talking points with design',
    content:
      'Discuss navigation friction in the sidebar, gather feedback on note creation flow, and agree on the next round of polish for the editor states.',
    isArchived: true,
    categories: ['Meetings'],
  },
  {
    title: 'Weekend planning ideas',
    content:
      'Book a dinner reservation, make a short packing checklist for the day trip, and leave a couple of hours open for reading and rest.',
    isArchived: true,
    categories: ['Personal'],
  },
];

async function seed() {
  await dataSource.initialize();

  const categoryRepository = dataSource.getRepository(Category);
  const noteRepository = dataSource.getRepository(Note);

  const categoryMap = new Map<string, Category>();

  for (const categoryName of categoryNames) {
    let category = await categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      category = categoryRepository.create({ name: categoryName });
      category = await categoryRepository.save(category);
    }

    categoryMap.set(categoryName, category);
  }

  for (const seedNote of seedNotes) {
    const categories = seedNote.categories
      .map((categoryName) => categoryMap.get(categoryName))
      .filter((category): category is Category => Boolean(category));

    let note = await noteRepository.findOne({
      where: { title: seedNote.title },
    });

    if (!note) {
      note = noteRepository.create({
        title: seedNote.title,
        content: seedNote.content,
        isArchived: seedNote.isArchived,
        categories,
      });
    } else {
      note.title = seedNote.title;
      note.content = seedNote.content;
      note.isArchived = seedNote.isArchived;
      note.categories = categories;
    }

    await noteRepository.save(note);
  }

  console.log(`Seed completed: ${categoryNames.length} categories and ${seedNotes.length} notes ready.`);
  await dataSource.destroy();
}

void seed().catch(async (error) => {
  console.error('Seed failed', error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});

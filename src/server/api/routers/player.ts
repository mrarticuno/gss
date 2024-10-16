import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

// Define the input schemas outside the router

// Schema for player attributes
const playerAttributesSchema = z.object({
  ballControl: z.number().int().min(0).max(100),
  dribbling: z.number().int().min(0).max(100),
  marking: z.number().int().min(0).max(100),
  slideTackle: z.number().int().min(0).max(100),
  standTackle: z.number().int().min(0).max(100),
  aggression: z.number().int().min(0).max(100),
  reactions: z.number().int().min(0).max(100),
  attPosition: z.number().int().min(0).max(100),
  interceptions: z.number().int().min(0).max(100),
  vision: z.number().int().min(0).max(100),
  composure: z.number().int().min(0).max(100),
  crossing: z.number().int().min(0).max(100),
  shortPass: z.number().int().min(0).max(100),
  longPass: z.number().int().min(0).max(100),
  acceleration: z.number().int().min(0).max(100),
  stamina: z.number().int().min(0).max(100),
  strength: z.number().int().min(0).max(100),
  balance: z.number().int().min(0).max(100),
  sprintSpeed: z.number().int().min(0).max(100),
  agility: z.number().int().min(0).max(100),
  jumping: z.number().int().min(0).max(100),
  heading: z.number().int().min(0).max(100),
  shotPower: z.number().int().min(0).max(100),
  finishing: z.number().int().min(0).max(100),
  longShots: z.number().int().min(0).max(100),
  curve: z.number().int().min(0).max(100),
  fkAccuracy: z.number().int().min(0).max(100),
  penalties: z.number().int().min(0).max(100),
  volleys: z.number().int().min(0).max(100),
  gkPositioning: z.number().int().min(0).max(100),
  gkDiving: z.number().int().min(0).max(100),
  gkHandling: z.number().int().min(0).max(100),
  gkKicking: z.number().int().min(0).max(100),
  gkReflexes: z.number().int().min(0).max(100),
});

// Schema for creating a player
const createPlayerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    position: z.string().min(1),
    teamId: z.number().int().optional(),
    specialities: z.array(z.string()).optional(),
    traits: z.array(z.string()).optional(),
  })
  .merge(playerAttributesSchema);

// Schema for updating a player
const updatePlayerSchema = z.object({
  id: z.number().int(),
  data: z
    .object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      position: z.string().min(1).optional(),
      teamId: z.number().int().nullable().optional(),
      specialities: z.array(z.string()).optional(),
      traits: z.array(z.string()).optional(),
    })
    .merge(playerAttributesSchema.partial()),
});

// Schema for player ID
const playerIdSchema = z.object({
  id: z.number().int(),
});

export const playerRouter = createTRPCRouter({
  // Create a new player
  create: protectedProcedure
    .input(createPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      const { specialities, traits, teamId, ...playerData } = input;

      // Create the player
      const newPlayer = await ctx.db.player.create({
        data: {
          ...playerData,
          team: teamId ? { connect: { id: teamId } } : undefined,
        },
      });

      // Connect specialities if provided
      if (specialities && specialities.length > 0) {
        for (const name of specialities) {
          const speciality = await ctx.db.speciality.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          await ctx.db.playerSpeciality.create({
            data: {
              playerId: newPlayer.id,
              specialityId: speciality.id,
            },
          });
        }
      }

      // Connect traits if provided
      if (traits && traits.length > 0) {
        for (const name of traits) {
          const trait = await ctx.db.trait.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          await ctx.db.playerTrait.create({
            data: {
              playerId: newPlayer.id,
              traitId: trait.id,
            },
          });
        }
      }

      return newPlayer;
    }),

  // Get a player by ID
  getById: publicProcedure
    .input(playerIdSchema)
    .query(async ({ ctx, input }) => {
      const player = await ctx.db.player.findUnique({
        where: { id: input.id },
        include: {
          team: true,
          specialities: {
            include: {
              speciality: true,
            },
          },
          traits: {
            include: {
              trait: true,
            },
          },
        },
      });
      return player;
    }),

  // Get all players
  getAll: publicProcedure.query(async ({ ctx }) => {
    const players = await ctx.db.player.findMany({
      include: {
        team: true,
        specialities: {
          include: {
            speciality: true,
          },
        },
        traits: {
          include: {
            trait: true,
          },
        },
      },
    });
    return players;
  }),

  // Update a player's information
  update: protectedProcedure
    .input(updatePlayerSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const { specialities, traits, teamId, ...playerData } = data;

      // Update the player
      const updatedPlayer = await ctx.db.player.update({
        where: { id },
        data: {
          ...playerData,
          team: teamId !== undefined ? { connect: { id: teamId } } : undefined,
        },
      });

      // Update specialities if provided
      if (specialities !== undefined) {
        // Delete existing specialities
        await ctx.db.playerSpeciality.deleteMany({
          where: { playerId: id },
        });

        // Add new specialities
        for (const name of specialities) {
          const speciality = await ctx.db.speciality.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          await ctx.db.playerSpeciality.create({
            data: {
              playerId: id,
              specialityId: speciality.id,
            },
          });
        }
      }

      // Update traits if provided
      if (traits !== undefined) {
        // Delete existing traits
        await ctx.db.playerTrait.deleteMany({
          where: { playerId: id },
        });

        // Add new traits
        for (const name of traits) {
          const trait = await ctx.db.trait.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          await ctx.db.playerTrait.create({
            data: {
              playerId: id,
              traitId: trait.id,
            },
          });
        }
      }

      return updatedPlayer;
    }),

  // Delete a player
  delete: protectedProcedure
    .input(playerIdSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.player.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});

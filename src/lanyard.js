const DISCORD_USER_ID = "1426711359059394662";
const API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

async function fetchDiscordData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch Discord data');
    }
    const { data, success } = await response.json();
    
    if (!success) {
      throw new Error('Invalid response from Lanyard API');
    }

    const {
      discord_user,
      discord_status,
      activities = [],
      active_on_discord_web,
      active_on_discord_desktop,
      active_on_discord_mobile,
      active_on_discord_embedded,
      listening_to_spotify,
      spotify,
      kv = {}
    } = data;

    const customStatus = activities.find(a => a.type === 4);
    const gameActivity = activities.find(a => a.type === 0);

    return {
      user: {
        id: discord_user.id,
        username: discord_user.username,
        discriminator: discord_user.discriminator,
        displayName: discord_user.display_name || discord_user.username,
        globalName: discord_user.global_name,
        avatar: discord_user.avatar,
        avatarUrl: `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`,
        publicFlags: discord_user.public_flags,
        avatarDecoration: discord_user.avatar_decoration_data ? {
          asset: discord_user.avatar_decoration_data.asset,
          expiresAt: discord_user.avatar_decoration_data.expires_at,
          skuId: discord_user.avatar_decoration_data.sku_id
        } : null,
        displayNameStyles: discord_user.display_name_styles ? {
          colors: discord_user.display_name_styles.colors,
          effectId: discord_user.display_name_styles.effect_id,
          fontId: discord_user.display_name_styles.font_id
        } : null,
        primaryGuild: discord_user.primary_guild ? {
          badge: discord_user.primary_guild.badge,
          identityEnabled: discord_user.primary_guild.identity_enabled,
          identityGuildId: discord_user.primary_guild.identity_guild_id,
          tag: discord_user.primary_guild.tag
        } : null
      },
      status: {
        discord: discord_status,
        web: active_on_discord_web,
        desktop: active_on_discord_desktop,
        mobile: active_on_discord_mobile,
        embedded: active_on_discord_embedded
      },
      activity: {
        customStatus: customStatus ? {
          state: customStatus.state,
          emoji: customStatus.emoji,
          createdAt: customStatus.created_at
        } : null,
        current: gameActivity ? {
          name: gameActivity.name,
          type: gameActivity.type,
          details: gameActivity.details,
          state: gameActivity.state,
          timestamps: gameActivity.timestamps,
          assets: gameActivity.assets,
          applicationId: gameActivity.application_id
        } : null,
        spotify: listening_to_spotify ? spotify : null
      },
      kv
    };
  } catch (error) {
    console.error('Error fetching Discord data:', error);
    throw error;
  }
}

export { fetchDiscordData, DISCORD_USER_ID, API_URL };
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package neocode_test

import (
	"context"
	"os"
	"testing"

	"github.com/neopilot-ai/neocode-sdk-go"
	"github.com/neopilot-ai/neocode-sdk-go/internal/testutil"
	"github.com/neopilot-ai/neocode-sdk-go/option"
)

func TestUsage(t *testing.T) {
	baseURL := "http://localhost:4010"
	if envURL, ok := os.LookupEnv("TEST_API_BASE_URL"); ok {
		baseURL = envURL
	}
	if !testutil.CheckTestServer(t, baseURL) {
		return
	}
	client := neocode.NewClient(
		option.WithBaseURL(baseURL),
	)
	sessions, err := client.Session.List(context.TODO())
	if err != nil {
		t.Error(err)
		return
	}
	t.Logf("%+v\n", sessions)
}
